-- CreateTable
CREATE TABLE "click_event" (
    "id" SERIAL NOT NULL,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url_short_code" TEXT NOT NULL,

    CONSTRAINT "click_event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "click_event" ADD CONSTRAINT "click_event_url_short_code_fkey" FOREIGN KEY ("url_short_code") REFERENCES "urls"("short_code") ON DELETE RESTRICT ON UPDATE CASCADE;
