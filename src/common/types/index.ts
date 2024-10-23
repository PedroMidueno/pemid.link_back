export interface User {
  id: number
  firstName: string
  lastName: string,
  email: string,
  deleted?: boolean
  createdAt: Date,
  password?: string
}
