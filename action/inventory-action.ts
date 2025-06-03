'use server'
import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/interface/actionType";
import { revalidatePath } from "next/cache";
import { Customer, Product } from "@prisma/client";

export async function preOrderProduct(
    data: { quantity: number },
    product: Product,
    customer: Customer | null,
): Promise<ActionResponse> {

    if (!customer) {
        return {
            success: false,
            message: 'Please add Customer'
        }
    }
    const dataPreorder = await prisma.preOrder.create({
        data: {
            productId: product.id,
            estimatedDate: new Date(),
            status: 'Order',
            quantity: data.quantity,
            customerId: customer.id
        }
    })

    revalidatePath('/')

    return {
        success: true,
        message: "Successfully ordered",
        data: dataPreorder
    }
}

export async function validPreorderProduct(id: number): Promise<ActionResponse> {
    const dataFind = await prisma.preOrder.findUnique({
        where: { id }
    })
    if (!dataFind) {
        return {
            success: false,
            message: "Preorder Is not found",
        }
    }

    const response = await prisma.$transaction(async (tx) => {

        const dataPreorder = await tx.preOrder.update({
            where: { id },
            data: { status: 'Success' }
        })

        await tx.product.update({
            where: { id: dataPreorder.productId },
            data: { stock: { increment: dataPreorder.quantity }, }
        })
        return dataPreorder
    })

    revalidatePath('/')

    return {
        success: true,
        message: "Successfully ordered",
        data: response
    }
}

export async function deletePreorderProduct(id: number): Promise<ActionResponse> {

    const dataFind = await prisma.preOrder.findUnique({
        where: { id }
    })
    if (!dataFind) {
        return {
            success: false,
            message: "Preorder Is not found",
        }
    }

    const response = prisma.preOrder.delete({ where: { id } })

    revalidatePath('/')

    return {
        success: true,
        message: "Successfully ordered",
        data: response
    }
}

export async function getPreOrderStatusCount(status: 'Pending' | 'Success') {
    return prisma.preOrder.count({
        where: { status }
    })
}

