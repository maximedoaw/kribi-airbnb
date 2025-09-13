export interface UserData {
    uid: string
    email: string
    displayName?: string
    photoURL?: string
    phoneNumber?: string
    role: "user" | "admin"
    isBanned?: boolean
    createdAt: any // Firestore Timestamp or Date
    lastLogin: any // Firestore Timestamp or Date
    updatedAt?: any
  }
  
  export interface UserFormData {
    role: "user" | "admin"
    isBanned: boolean
  }
  