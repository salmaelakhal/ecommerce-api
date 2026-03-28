# Fix PrismaClientValidationError on /orders/index?status=invalid

Status: Working...

## Plan Steps:
1. ✅ Create this TODO.md
2. ✅ Add global validStatuses const and validate in listAllOrders & listUserOrders in `src/controllers/orders.ts`
3. ✅ Test the endpoints (GET /orders/index?status=ACCEPTED should work; ?status=ACCEPETED returns 400)
4. Update TODO.md and complete

