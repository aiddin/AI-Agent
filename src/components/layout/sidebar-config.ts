// Sidebar menu configuration
export interface MenuItem {
  label: string
  route: string
  icon: string
  id?: string
}

export interface MenuSection {
  title: string
  icon: string
  items: MenuItem[]
}

export const menuConfig: MenuSection[] = [
  {
    title: 'CHATBOT',
    icon: 'layout',
    items: [
      {
        label: 'PB Customer Support',
        route: '/chatbot/customer-support',
        icon: 'chat',
        id: 'chatbot1'
      },
      {
        label: 'Medical AI Assistant',
        route: '/chatbot/medical-assistant',
        icon: 'scrumboard',
        id: 'chatbot2'
      },
      {
        label: 'Uni Program Advisor',
        route: '/chatbot/uni-program-advisor',
        icon: 'scrumboard',
        id: 'chatbot6'
      },
      {
        label: 'Pet Sitter Trainer',
        route: '/chatbot/pet-trainer',
        icon: 'documentation',
        id: 'chatbot3'
      },
      {
        label: 'Mortgage Assistant',
        route: '/chatbot/mortgage-assistant',
        icon: 'invoice',
        id: 'chatbot4'
      },
      {
        label: 'Mortgage Documents',
        route: '/chatbot/mortgage-documents',
        icon: 'forms',
        id: 'chatbot5'
      }
    ]
  },
  {
    title: 'WORKFLOW',
    icon: 'activity',
    items: [
      {
        label: 'Applicant Scoring',
        route: '/workflow/applicant-scoring',
        icon: 'users'
      },
      {
        label: 'PB Issue Classification',
        route: '/workflow/issue-classification',
        icon: 'components'
      },
      {
        label: 'Purchase Order Extraction',
        route: '/workflow/purchase-order',
        icon: 'invoice'
      },
      {
        label: 'Data Cleansing',
        route: '/workflow/data-cleansing',
        icon: 'datatables'
      },
      {
        label: 'Receipt Claim Analyzer',
        route: '/workflow/receipt-claim',
        icon: 'forms'
      },
      {
        label: 'Document Chat',
        route: '/workflow/document-chat',
        icon: 'chat'
      }
    ]
  }
]
