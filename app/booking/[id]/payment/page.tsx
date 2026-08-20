// This route is handled by the MultiStepBooking component's payment step.
// Redirect to the main booking page to prevent accessing an obsolete prototype.
import { redirect } from 'next/navigation'

export default async function CustomerPaymentPage() {
  redirect('/booking')
}
