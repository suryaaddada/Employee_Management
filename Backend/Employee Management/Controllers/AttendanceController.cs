using Employee_Management.Model;
using Employee_Management.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _service;

    public AttendanceController(IAttendanceService service)
    {
        _service = service;
    }

    [HttpPost("mark")]
    public async Task<IActionResult> Mark(AttendanceDto dto)
    {
        var result = await _service.MarkAttendanceAsync(dto);
        return Ok(result);
    }

    [HttpGet("{employeeId}")]
    public async Task<IActionResult> GetByEmployee(int employeeId)
    {
        var data = await _service.GetByEmployeeAsync(employeeId);
        return Ok(data);
    }
}