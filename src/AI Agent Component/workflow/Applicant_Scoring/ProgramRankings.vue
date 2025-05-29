<template>
  <div class="program-rankings">
    <!-- Main Content -->
    <div class="main-content">
      <h1 class="page-title">Program Rankings</h1>
      
      <!-- Parameter Controls -->
      <div class="parameter-controls">
        <div class="control-group">
          <label for="max-offers">Maximum offers per program</label>
          <div class="slider-container">
            <span class="slider-min">1</span>
            <input 
              type="range" 
              id="max-offers" 
              v-model.number="maxOffers" 
              min="1" 
              max="10" 
              step="1"
              class="slider"
            />
            <span class="slider-max">10</span>
          </div>
          <span class="slider-value">{{ maxOffers }}</span>
        </div>
        
        <div class="control-group">
          <label for="min-score">Minimum score threshold</label>
          <div class="slider-container">
            <span class="slider-min">0</span>
            <input 
              type="range" 
              id="min-score" 
              v-model.number="minScore" 
              min="0" 
              max="100" 
              step="5"
              class="slider"
            />
            <span class="slider-max">100</span>
          </div>
          <span class="slider-value">{{ minScore }}</span>
        </div>
      </div>
      
      <!-- Load Data Button -->
      <button 
        @click="loadStudentData" 
        :disabled="loading"
        class="action-button"
      >
        Load Student Application Data
      </button>
    
      <!-- Loading Indicator -->
      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Fetching data from database...</p>
      </div>
    
      <!-- Results Section -->
    <div v-if="offerStats" class="results-section">
      <!-- Overall Statistics -->
      <div class="stats-card">
        <h3>Offer Statistics</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ offerStats.totalStudents }}</div>
            <div class="stat-label">Total Students</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ offerStats.studentsWithOffers }}</div>
            <div class="stat-label">Students with Offers</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ offerStats.studentsWithoutOffers }}</div>
            <div class="stat-label">Students without Offers</div>
          </div>
        </div>
      </div>
      
      <!-- Program Summary -->
      <h3>Program Summary</h3>
      <table class="summary-table">
        <thead>
          <tr>
            <th>Program</th>
            <th>Total Applicants</th>
            <th>Offers Made</th>
            <th>Spaces Remaining</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stat in programStats" :key="stat.Program">
            <td>{{ stat.Program }}</td>
            <td>{{ stat['Total Applicants'] }}</td>
            <td>{{ stat['Offers Made'] }}</td>
            <td>{{ stat['Spaces Remaining'] }}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Program Details -->
      <h3>Program Details</h3>
      <div class="program-details">
        <div v-for="program in programs" :key="program" class="program-card">
          <div 
            class="program-header" 
            @click="toggleProgramDetails(program)"
            :class="{ 'expanded': expandedPrograms.includes(program) }"
          >
            <h4>{{ program }}</h4>
            <div class="offer-count">{{ getProgramOfferCount(program) }} offers made</div>
            <div class="expand-icon">{{ expandedPrograms.includes(program) ? '▼' : '►' }}</div>
          </div>
          
          <div v-if="expandedPrograms.includes(program)" class="program-content">
            <table class="program-table">
              <thead>
                <tr>
                  <th>Reference Number</th>
                  <th>Choice</th>
                  <th>Match Score</th>
                  <th>Program Rank</th>
                  <th>Offer</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="student in getProgramStudents(program)" 
                  :key="`${program}-${student.reference_number}`"
                  :class="{ 'offered': student.offer }"
                >
                  <td>{{ student.reference_number }}</td>
                  <td>{{ formatChoice(student.choice) }}</td>
                  <td :style="{ backgroundColor: getScoreColor(student.match_score) ,color: 'black'}">
                    {{ student.match_score }}
                  </td>
                  <td>{{ student.program_rank }}</td>
                  <td>{{ student.offer ? 'Yes' : 'No' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- No Data Message -->
    <div v-if="noData" class="no-data-message">
      <p>No data found or failed to load data.</p>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      maxOffers: 2,
      minScore: 50,
      loading: false,
      studentData: [],
      matchResults: [],
      rankings: [],
      rankingsWithOffers: [],
      programs: [],
      programStats: [],
      offerStats: null,
      expandedPrograms: [],
      noData: false
    };
  },
  methods: {
    async loadStudentData() {
      this.loading = true;
      this.noData = false;
      
      try {
        const response = await axios.get('https://n8n.forwen.com/webhook/790cbf44-3319-46ab-9a2c-8847c899f095');
        console.log('API Response:', response.data);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // Process the API response to ensure we're using the correct reference numbers
          const processedData = response.data.map(student => {
            // If the API response includes a 'ref' field, use it as the reference_number
            if (student.ref && !student.reference_number) {
              return {
                ...student,
                reference_number: student.ref
              };
            }
            return student;
          });
          
          this.studentData = processedData;
          console.log('Processed Student Data:', this.studentData);
          this.processData();
        } else {
          this.noData = true;
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        this.noData = true;
      } finally {
        this.loading = false;
      }
    },
    
    processData() {
      // Process program matches
      this.matchResults = this.processStudentMatches(this.studentData);
      
      // Generate program rankings
      this.rankings = this.generateProgramRankings(this.matchResults);
      
      // Assign students to programs
      this.rankingsWithOffers = this.assignStudentsToPrograms(
        this.rankings, 
        this.maxOffers, 
        this.minScore
      );
      
      // Get unique programs
      this.programs = [...new Set(this.rankingsWithOffers.map(r => r.Program))].sort();
      
      // Generate program statistics
      this.generateProgramStats();
      
      // Generate offer statistics
      this.generateOfferStats();
      
      // Expand the first program by default
      if (this.programs.length > 0 && this.expandedPrograms.length === 0) {
        this.expandedPrograms = [this.programs[0]];
      }
    },
    
    processStudentMatches(studentData) {
      const allMatches = [];
      
      for (const student of studentData) {
        const studentId = student.reference_number;
        const selectedPrograms = new Set(); // Track programs already selected by this student
        
        if (student.choice1 && student.c1_score !== undefined && student.c1_score !== null) {
          const program = student.choice1;
          if (!selectedPrograms.has(program)) {
            selectedPrograms.add(program);
            allMatches.push({
              reference_number: studentId,
              Program: program,
              match_score: parseFloat(student.c1_score),
              choice: 1
            });
          }
        }
        
        if (student.choice2 && student.c2_score !== undefined && student.c2_score !== null) {
          const program = student.choice2;
          if (!selectedPrograms.has(program)) {
            selectedPrograms.add(program);
            allMatches.push({
              reference_number: studentId,
              Program: program,
              match_score: parseFloat(student.c2_score),
              choice: 2
            });
          }
        }
        
        if (student.choice3 && student.c3_score !== undefined && student.c3_score !== null) {
          const program = student.choice3;
          if (!selectedPrograms.has(program)) {
            selectedPrograms.add(program);
            allMatches.push({
              reference_number: studentId,
              Program: program,
              match_score: parseFloat(student.c3_score),
              choice: 3
            });
          }
        }
      }
      
      return allMatches;
    },
    
    generateProgramRankings(matchData) {
      const programs = [...new Set(matchData.map(m => m.Program))];
      const allRankings = [];
      
      for (const program of programs) {
        const programData = matchData
          .filter(m => m.Program === program)
          .sort((a, b) => b.match_score - a.match_score);
        
        // Add program rank
        programData.forEach((student, index) => {
          allRankings.push({
            ...student,
            program_rank: index + 1,
            offer: false
          });
        });
      }
      
      return allRankings;
    },
    
    assignStudentsToPrograms(rankings, maxOffersPerProgram, minScoreThreshold) {
      const rankingsCopy = JSON.parse(JSON.stringify(rankings));
      const uniqueStudents = [...new Set(rankingsCopy.map(r => r.reference_number))];
      const programs = [...new Set(rankingsCopy.map(r => r.Program))];
      const assignedStudents = new Set();
      const programOffers = {};
      
      // Initialize program offers count
      for (const program of programs) {
        programOffers[program] = 0;
      }
      
      // First pass: Assign students to their first choice programs
      for (const student of uniqueStudents) {
        const studentChoices = rankingsCopy
          .filter(r => r.reference_number === student)
          .sort((a, b) => a.choice - b.choice);
        
        if (studentChoices.length > 0) {
          const firstChoice = studentChoices.find(c => c.choice === 1);
          
          if (firstChoice) {
            const program = firstChoice.Program;
            const score = firstChoice.match_score;
            
            // Check if the program has space and the student meets the minimum score
            if (programOffers[program] < maxOffersPerProgram && score >= minScoreThreshold) {
              // Find this student's rank in this program
              const studentRank = rankingsCopy.find(
                r => r.Program === program && r.reference_number === student
              ).program_rank;
              
              // Make sure student is within the top maxOffers for this program
              if (studentRank <= maxOffersPerProgram) {
                // Update offer status
                rankingsCopy.forEach(r => {
                  if (r.reference_number === student && r.Program === program) {
                    r.offer = true;
                  }
                });
                
                assignedStudents.add(student);
                programOffers[program]++;
              }
            }
          }
        }
      }
      
      // Second pass: Try to assign remaining students to their second choices
      for (const student of uniqueStudents) {
        if (assignedStudents.has(student)) continue;
        
        const studentChoices = rankingsCopy
          .filter(r => r.reference_number === student)
          .sort((a, b) => a.choice - b.choice);
        
        if (studentChoices.length > 0) {
          const secondChoice = studentChoices.find(c => c.choice === 2);
          
          if (secondChoice) {
            const program = secondChoice.Program;
            const score = secondChoice.match_score;
            
            if (programOffers[program] < maxOffersPerProgram && score >= minScoreThreshold) {
              const studentRank = rankingsCopy.find(
                r => r.Program === program && r.reference_number === student
              ).program_rank;
              
              if (studentRank <= maxOffersPerProgram) {
                rankingsCopy.forEach(r => {
                  if (r.reference_number === student && r.Program === program) {
                    r.offer = true;
                  }
                });
                
                assignedStudents.add(student);
                programOffers[program]++;
              }
            }
          }
        }
      }
      
      // Third pass: Try to assign remaining students to their third choices
      for (const student of uniqueStudents) {
        if (assignedStudents.has(student)) continue;
        
        const studentChoices = rankingsCopy
          .filter(r => r.reference_number === student)
          .sort((a, b) => a.choice - b.choice);
        
        if (studentChoices.length > 0) {
          const thirdChoice = studentChoices.find(c => c.choice === 3);
          
          if (thirdChoice) {
            const program = thirdChoice.Program;
            const score = thirdChoice.match_score;
            
            if (programOffers[program] < maxOffersPerProgram && score >= minScoreThreshold) {
              const studentRank = rankingsCopy.find(
                r => r.Program === program && r.reference_number === student
              ).program_rank;
              
              if (studentRank <= maxOffersPerProgram) {
                rankingsCopy.forEach(r => {
                  if (r.reference_number === student && r.Program === program) {
                    r.offer = true;
                  }
                });
                
                assignedStudents.add(student);
                programOffers[program]++;
              }
            }
          }
        }
      }
      
      return rankingsCopy;
    },
    
    generateProgramStats() {
      this.programStats = [];
      
      for (const program of this.programs) {
        const programData = this.rankingsWithOffers.filter(r => r.Program === program);
        const offersMade = programData.filter(r => r.offer).length;
        
        this.programStats.push({
          Program: program,
          'Total Applicants': programData.length,
          'Offers Made': offersMade,
          'Spaces Remaining': this.maxOffers - offersMade
        });
      }
    },
    
    generateOfferStats() {
      const totalStudents = [...new Set(this.rankingsWithOffers.map(r => r.reference_number))].length;
      const studentsWithOffers = [...new Set(
        this.rankingsWithOffers
          .filter(r => r.offer)
          .map(r => r.reference_number)
      )].length;
      
      this.offerStats = {
        totalStudents,
        studentsWithOffers,
        studentsWithoutOffers: totalStudents - studentsWithOffers
      };
    },
    
    getProgramStudents(program) {
      return this.rankingsWithOffers
        .filter(r => r.Program === program)
        .sort((a, b) => {
          // Sort by offer status first (offers first)
          if (a.offer !== b.offer) return b.offer ? 1 : -1;
          // Then by program rank
          return a.program_rank - b.program_rank;
        });
    },
    
    getProgramOfferCount(program) {
      return this.rankingsWithOffers
        .filter(r => r.Program === program && r.offer)
        .length;
    },
    
    toggleProgramDetails(program) {
      if (this.expandedPrograms.includes(program)) {
        this.expandedPrograms = this.expandedPrograms.filter(p => p !== program);
      } else {
        this.expandedPrograms.push(program);
      }
    },
    
    formatChoice(choice) {
      switch (choice) {
        case 1: return 'First Choice';
        case 2: return 'Second Choice';
        case 3: return 'Third Choice';
        default: return `Choice ${choice}`;
      }
    },
    
    getScoreColor(score) {
      const numScore = parseFloat(score);
      
      if (isNaN(numScore)) return '';
      
      if (numScore >= 80) return '#CCFFCC'; // Light green
      if (numScore >= 60) return '#FFFFCC'; // Light yellow
      return '#FFCCCC'; // Light red
    }
  },
  watch: {
    maxOffers() {
      if (this.studentData.length > 0) {
        this.processData();
      }
    },
    minScore() {
      if (this.studentData.length > 0) {
        this.processData();
      }
    }
  }
};
</script>

<style scoped>
.program-rankings {
  display: flex;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
}

/* Navigation Sidebar */
.navigation-sidebar {
  width: 200px;
  background-color: #2a2a2a;
  padding: 20px 0;
  border-right: 1px solid #3a3a3a;
}

.nav-header {
  color: #888;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 20px;
  margin-bottom: 15px;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  color: #ccc;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-item.active {
  background-color: #3a3a3a;
  color: #fff;
  border-left: 3px solid #dc3545;
}

.nav-item:hover {
  background-color: #3a3a3a;
}

.dropdown-icon {
  color: #888;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 40px;
  max-width: 1200px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 40px;
}

/* Parameter Controls */
.parameter-controls {
  margin-bottom: 30px;
}

.control-group {
  margin-bottom: 30px;
}

.control-group label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 15px;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.slider-min,
.slider-max {
  font-size: 14px;
  color: #888;
  min-width: 20px;
}

.slider {
  flex: 1;
  height: 6px;
  background: #3a3a3a;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #dc3545;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #dc3545;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.slider-value {
  font-size: 16px;
  font-weight: 600;
  color: #dc3545;
  min-width: 30px;
  text-align: center;
}

/* Action Button */
.action-button {
  background-color: #4a4a4a;
  color: #ffffff;
  border: 1px solid #666;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 30px;
}

.action-button:hover {
  background-color: #555;
}

.action-button:disabled {
  background-color: #333;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Loading Indicator */
.loading-indicator {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #ccc;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top: 3px solid #4CAF50;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Results Section */
.results-section {
  margin-top: 30px;
}

.stats-card {
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid #3a3a3a;
}

.stats-card h3 {
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.stats-grid {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.stat-item {
  text-align: center;
  min-width: 120px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #ffffff;
}

.stat-label {
  font-size: 14px;
  color: #888;
}

/* Tables */
.summary-table, .program-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
}

.summary-table th,
.summary-table td,
.program-table th,
.program-table td {
  border: 1px solid #3a3a3a;
  padding: 12px;
  text-align: left;
  color: #ffffff;
}

.summary-table th,
.program-table th {
  background-color: #333;
  font-weight: 600;
  color: #fff;
}

.summary-table td,
.program-table td {
  background-color: #2a2a2a;
}

.summary-table tr:hover td,
.program-table tr:hover td {
  background-color: #333;
}

/* Program Details */
.program-details {
  margin-top: 20px;
}

.program-card {
  margin-bottom: 15px;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  overflow: hidden;
  background-color: #2a2a2a;
}

.program-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  background-color: #333;
  transition: background-color 0.2s;
}

.program-header:hover {
  background-color: #3a3a3a;
}

.program-header h4 {
  margin: 0;
  flex: 1;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

.offer-count {
  margin-right: 15px;
  font-weight: bold;
  color: #ccc;
}

.expand-icon {
  font-size: 12px;
  color: #888;
}

.program-content {
  padding: 20px;
  background-color: #2a2a2a;
}

.offered {
  background-color: #36c736 !important;
}

/* No Data Message */
.no-data-message {
  margin-top: 20px;
  padding: 20px;
  background-color: #8b7355;
  border-radius: 8px;
  color: #ffffff;
  text-align: center;
}

/* Section Headers */
h3 {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  margin-top: 30px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .program-rankings {
    flex-direction: column;
  }
  
  .navigation-sidebar {
    width: 100%;
    padding: 15px 0;
  }
  
  .main-content {
    padding: 20px;
  }
  
  .stats-grid {
    flex-direction: column;
    align-items: center;
  }
}
</style>
