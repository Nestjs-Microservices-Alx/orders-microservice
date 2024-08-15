/*
  Warnings:

  - You are about to drop the column `product_id` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `productId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "product_id",
ADD COLUMN     "productId" TEXT NOT NULL;
