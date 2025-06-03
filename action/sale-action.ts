'use server'
import { prisma } from "@/lib/prisma";
import { ActionResponse, CartItem } from "@/interface/actionType";
import { revalidatePath } from "next/cache";
import { Customer, Product, Sale, SalesItem } from "@prisma/client";

export type SaleCustomers = Sale & {
    customer: Customer
    SaleItems: (SalesItem & { product: Product })[]
};

export async function SaleCustomers(): Promise<SaleCustomers[]> {
    return prisma.sale.findMany({
        orderBy: { date: 'desc' },
        include: {
            customer: true,
            SaleItems: { include: { product: true } }
        }
    })
}

// export type SalesData = Sale & { customer: Customer };
//
// export async function getSales(): Promise<SalesData[]> {
//     return prisma.sale.findMany({
//         orderBy: {
//             date: 'desc'
//         },
//         include: {
//             customer: true
//         }
//     })
// }

export async function createTransaction(product: CartItem[], customer: Customer | null): Promise<ActionResponse> {
    // console.log('execute');
    try {
        if (!customer) {
            return {
                message: "Please Select Customer Data",
                success: false,
            }
        }

        const dataTransaction = await prisma.$transaction(async (tx) => {
            const saleDB = await tx.sale.create({
                data: {
                    items: product.length,
                    total: product.reduce((a, b) => a + (b.price * b.quantity), 0),
                    date: new Date(),
                    customerId: customer.id,
                }
            })

            const saleItemList = product.map(item => {
                return {
                    saleId: saleDB.id,
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    category: item.category,
                }
            })

            for (const item of saleItemList) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            await tx.customer.update({
                where: { id: customer.id },
                data: {
                    lastPurchase: new Date(),
                    totalPurchase: { increment: saleItemList.reduce((a, b) => a + b.price * b.quantity, 0) },
                },
            });

            // await Promise.all(
            //     product.map(item =>
            //         tx.product.update({
            //             where: { id: item.id },
            //             data: { stock: { decrement: item.stock } },
            //         })
            //     )
            // );

            const saleItemDB = await tx.salesItem.createMany({ data: saleItemList })
            return {
                saleItemDB,
                saleDB
            }
        })
        revalidatePath('/')
        return {
            data: dataTransaction,
            message: "Success Create Data",
            success: true,
        }

    } catch (error) {

        return {
            message: "Fail Create Data",
            success: false,
        }
    }
}

export type LastBuyer = Customer & {
    Sales: Sale[]
};

export async function lastBuyer(): Promise<LastBuyer[]> {
    return prisma.customer.findMany({
        take: 5,
        include: { Sales: true },
        orderBy: { lastPurchase: 'desc' }
    })
}

export const getTransactionCountToday = async () => {
    return prisma.sale.count({
        where: {
            date: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(24, 0, 0, 0)),
            },
        }
    })
}

export async function getTotalSoldToday() {
    const result = await prisma.salesItem.aggregate({
        _sum: {
            quantity: true,
        },
        where: {
            sale: {
                date: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lt: new Date(new Date().setHours(24, 0, 0, 0)),
                },
            },
        }
    })

    return result._sum.quantity ?? 0;
}