using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Entities.Enums;

public enum OrderStatus
{
    Pending,
    PaymentReceived,
    PaymentFailed,
    Paid,
    Shipped,
    Delivered,
    Cancelled
}
