using Employee_Management.Data;
using Employee_Management.Entities;
using Employee_Management.Model;
using Employee_Management.Services;
using Employee_Management.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace  Employee_Management .Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
   
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _service;

        public EmployeesController(IEmployeeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _service.GetAllAsync();

            return Ok(employees);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var emp = await _service.GetByIdAsync(id);
            if (emp == null)
                return NotFound();

            return Ok(emp);
        }

        [HttpPost]
        public async Task<IActionResult> Create(EmployeeDto dto)
        {
            var result = await _service.CreateAsync(dto);

            return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EmployeeDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);

            if (!updated)
                return NotFound("Employee not found");

            return Ok("Employee updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound("Employee not found");

            return Ok("Employee deleted successfully");
        }


        [HttpPost("delete-multiple")]
        public async Task<IActionResult> DeleteMultiple([FromBody] List<int> ids)
        {
            var multipledelete= await _service.DeleteMultipleAsync(ids);
             
            if(!multipledelete)
                return NotFound("One or more Employees not found or invalid ids bveing passed");

            return Ok("Employees deleted successfully");
        }
    }
}