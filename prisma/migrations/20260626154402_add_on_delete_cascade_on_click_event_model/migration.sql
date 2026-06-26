-- DropForeignKey
ALTER TABLE "click_event" DROP CONSTRAINT "click_event_url_short_code_fkey";

-- AddForeignKey
ALTER TABLE "click_event" ADD CONSTRAINT "click_event_url_short_code_fkey" FOREIGN KEY ("url_short_code") REFERENCES "urls"("short_code") ON DELETE CASCADE ON UPDATE CASCADE;
