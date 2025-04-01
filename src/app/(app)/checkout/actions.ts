"use server"

import { redirect } from "next/navigation"

export async function processCheckout(formData: FormData) {
  
  const totalAmount = formData.get("totalAmount") as string

  const orderId = `ORD${Date.now()}`
  redirect(`/payment?orderId=${orderId}&amount=${totalAmount}`)
}

