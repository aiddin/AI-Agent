<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-semibold dark:text-white-light">Program Rankings</h1>
      <p class="text-white-dark">Intelligent program allocation and ranking system</p>
    </div>

    <!-- Parameter Controls -->
    <div class="panel">
      <div class="mb-5">
        <h5 class="font-semibold text-lg dark:text-white-light">Configuration Parameters</h5>
        <p class="text-sm text-white-dark">Adjust settings for program allocation</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-3">
          <label class="font-medium dark:text-white-light">Maximum offers per program</label>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-white-dark min-w-[20px]">1</span>
            <input
              type="range"
              v-model.number="maxOffers"
              min="1"
              max="10"
              step="1"
              class="flex-1 h-2 bg-[#ebedf2] dark:bg-[#191e3a] rounded-lg appearance-none cursor-pointer slider"
            />
            <span class="text-sm text-white-dark min-w-[20px]">10</span>
          </div>
          <div class="text-center">
            <span class="badge bg-primary text-sm">{{ maxOffers }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <label class="font-medium dark:text-white-light">Minimum score threshold</label>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-white-dark min-w-[20px]">0</span>
            <input
              type="range"
              v-model.number="minScore"
              min="0"
              max="100"
              step="5"
              class="flex-1 h-2 bg-[#ebedf2] dark:bg-[#191e3a] rounded-lg appearance-none cursor-pointer slider"
            />
            <span class="text-sm text-white-dark min-w-[20px]">100</span>
          </div>
          <div class="text-center">
            <span class="badge bg-primary text-sm">{{ minScore }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Load Data Button -->
    <button
      @click="loadStudentData"
      :disabled="loading"
      class="btn btn-primary"
      :class="{ 'opacity-60 pointer-events-none': loading }"
    >
      {{ loading ? 'Loading...' : 'Load Student Application Data' }}
    </button>

    <!-- Loading Indicator -->
    <div v-if="loading" class="panel">
      <div class="flex items-center gap-3">
        <div class="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></div>
        <span class="font-medium dark:text-white-light">Fetching data from database...</span>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="offerStats" class="space-y-6">
      <!-- Overall Statistics -->
      <div class="panel">
        <div class="mb-5">
          <h5 class="font-semibold text-lg dark:text-white-light">Offer Statistics</h5>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg">
            <div class="text-2xl font-bold text-primary">{{ offerStats.totalStudents }}</div>
            <div class="text-sm text-white-dark">Total Students</div>
          </div>
          <div class="text-center p-4 bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg">
            <div class="text-2xl font-bold text-success">{{ offerStats.studentsWithOffers }}</div>
            <div class="text-sm text-white-dark">Students with Offers</div>
          </div>
          <div class="text-center p-4 bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg">
            <div class="text-2xl font-bold text-danger">{{ offerStats.studentsWithoutOffers }}</div>
            <div class="text-sm text-white-dark">Students without Offers</div>
          </div>
        </div>
      </div>

      <!-- Program Summary -->
      <div class="panel">
        <div class="mb-5">
          <h5 class="font-semibold text-lg dark:text-white-light">Program Summary</h5>
          <p class="text-sm text-white-dark">Overview of applications and offers by program</p>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th class="ltr:rounded-l-md rtl:rounded-r-md">Program</th>
                <th>Total Applicants</th>
                <th>Offers Made</th>
                <th class="ltr:rounded-r-md rtl:rounded-l-md">Spaces Remaining</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stat in programStats" :key="stat.Program"
                  class="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                <td class="text-black dark:text-white font-medium">{{ stat.Program }}</td>
                <td class="text-black dark:text-white">{{ stat['Total Applicants'] }}</td>
                <td class="text-black dark:text-white">
                  <span class="badge bg-success">{{ stat['Offers Made'] }}</span>
                </td>
                <td class="text-black dark:text-white">
                  <span class="badge"
                        :class="{
                          'bg-success': stat['Spaces Remaining'] > 0,
                          'bg-danger': stat['Spaces Remaining'] === 0
                        }">
                    {{ stat['Spaces Remaining'] }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Program Details -->
      <div class="panel">
        <div class="mb-5">
          <h5 class="font-semibold text-lg dark:text-white-light">Program Details</h5>
          <p class="text-sm text-white-dark">Detailed breakdown by program</p>
        </div>

        <div class="space-y-4">
          <div v-for="program in programs" :key="program" class="border border-[#ebedf2] dark:border-[#191e3a] rounded-lg overflow-hidden">
            <div
              class="program-header p-4 bg-[#f1f2f3] dark:bg-[#1b2e4b] cursor-pointer transition-colors duration-200 hover:bg-[#e6e7e8] dark:hover:bg-[#253047]"
              @click="toggleProgramDetails(program)"
            >
              <div class="flex items-center justify-between">
                <h6 class="font-semibold dark:text-white-light">{{ program }}</h6>
                <div class="flex items-center space-x-3">
                  <span class="badge bg-primary text-xs">{{ getProgramOfferCount(program) }} offers made</span>
                  <div class="text-white-dark">
                    {{ expandedPrograms.includes(program) ? '▼' : '►' }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="expandedPrograms.includes(program)" class="p-4">
              <div class="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th class="ltr:rounded-l-md rtl:rounded-r-md">Reference Number</th>
                      <th>Choice</th>
                      <th>Match Score</th>
                      <th>Program Rank</th>
                      <th class="ltr:rounded-r-md rtl:rounded-l-md">Offer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="student in getProgramStudents(program)"
                      :key="`${program}-${student.reference_number}`"
                      class="text-white-dark hover:text-black dark:hover:text-white-light/90 group"
                      :class="{ 'bg-success/10': student.offer }"
                    >
                      <td class="text-black dark:text-white">{{ student.reference_number }}</td>
                      <td class="text-black dark:text-white">{{ formatChoice(student.choice) }}</td>
                      <td>
                        <span class="badge"
                              :class="{
                                'bg-success': getScoreLevel(student.match_score) === 'high',
                                'bg-warning': getScoreLevel(student.match_score) === 'medium',
                                'bg-danger': getScoreLevel(student.match_score) === 'low'
                              }">
                          {{ student.match_score }}
                        </span>
                      </td>
                      <td class="text-black dark:text-white">{{ student.program_rank }}</td>
                      <td>
                        <span class="badge"
                              :class="{
                                'bg-success': student.offer,
                                'bg-secondary': !student.offer
                              }">
                          {{ student.offer ? 'Yes' : 'No' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Data Message -->
    <div v-if="noData" class="panel">
      <div class="text-center py-8">
        <div class="text-4xl mb-4">📊</div>
        <h3 class="text-lg font-semibold mb-2 dark:text-white-light">No Data Available</h3>
        <p class="text-white-dark">No data found or failed to load data. Please try again.</p>
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

    getScoreLevel(score) {
      const numScore = parseFloat(score);

      if (isNaN(numScore)) return 'low';

      if (numScore >= 80) return 'high';
      if (numScore >= 60) return 'medium';
      return 'low';
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
/* Custom slider styling */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--primary);
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--primary);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.program-header {
  transition: all 0.2s ease;
}
</style>
