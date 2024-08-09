import { DailySchedulerService } from "@/services"
import { Injectable } from "@nestjs/common"
import { Cron } from "@nestjs/schedule"

@Injectable()
export class DailyScheduler {
    constructor(private readonly dailyService: DailySchedulerService) {}

  @Cron("0 0 0 * * *", {
      name: "notifications",
      timeZone: "Asia/Ho_Chi_Minh",
  })
    async createSpinTicket() {
        await this.dailyService.createSpinTicket()
    }
}
