namespace Employee_Management.Model
{
    public class AttendanceDto
    {
        public int EmployeeId { get; set; }

        public DateTime Date { get; set; }

        public TimeSpan? CheckIn { get; set; }

        public TimeSpan? CheckOut { get; set; }

        public bool IsPresent { get; set; }
    }
}