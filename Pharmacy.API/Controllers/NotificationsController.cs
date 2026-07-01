using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.Core.Consts;
using Pharmacy.Core.Entities.Enums;
using Pharmacy.Core.Interfaces.Services;

namespace Pharmacy.API.Controllers;

[Authorize(Roles = DefaultRoles.Admin)]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController(INotificationService notificationService) : ControllerBase
{
    /// <summary>
    /// Returns all notifications. Pass ?status=Active|Read|Resolved to filter.
    /// Called by the Admin Dashboard to populate the notification list.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] NotificationStatus? status)
    {
        var notifications = await notificationService.GetNotificationsAsync(status);
        return Ok(notifications);
    }

    /// <summary>
    /// Returns the count of Active notifications — used for the badge in the dashboard.
    /// </summary>
    [HttpGet("count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var count = await notificationService.GetUnreadCountAsync();
        return Ok(new { count });
    }

    /// <summary>
    /// Marks a notification as Read so it no longer shows in the "new alerts" badge.
    /// </summary>
    [HttpPut("{id:int}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var success = await notificationService.MarkAsReadAsync(id);
        if (!success)
            return NotFound();

        return NoContent();
    }
}
