export interface Attendance {
  id?: number;
  employeeId: number;
  employeeName?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  isPresent: boolean;
}