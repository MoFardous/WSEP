
import { PrismaClient } from '@prisma/client';
import dashboardData from '../data/dashboard_data.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء عملية إدخال البيانات...');

  try {
    // Clear existing data
    await prisma.activity.deleteMany();
    await prisma.supportActivity.deleteMany();
    await prisma.risk.deleteMany();
    await prisma.phaseSummary.deleteMany();
    await prisma.dashboardSettings.deleteMany();
    
    console.log('✅ تم حذف البيانات القديمة');

    // Insert dashboard overview
    const dashboardSettings = await prisma.dashboardSettings.create({
      data: {
        totalActivities: dashboardData.overview.total_activities,
        completedActivities: dashboardData.overview.completed_activities,
        inProgressActivities: dashboardData.overview.in_progress_activities,
        delayedActivities: dashboardData.overview.delayed_activities,
        notStartedActivities: dashboardData.overview.not_started_activities,
        completionPercentage: dashboardData.overview.completion_percentage,
        timeProgressPercentage: dashboardData.timeline.time_progress_percentage,
        projectStart: dashboardData.timeline.project_start,
        currentDate: dashboardData.timeline.current_date,
      },
    });
    
    console.log('✅ تم إدراج إعدادات لوحة التحكم');

    // Insert phase summaries
    for (const phase of dashboardData.phases) {
      await prisma.phaseSummary.create({
        data: {
          name: phase.name,
          totalActivities: phase.total_activities,
          completedActivities: phase.completed_activities,
          completionPercentage: phase.completion_percentage,
        },
      });
    }
    
    console.log('✅ تم إدراج ملخصات المراحل');

    // Insert activities
    for (const phase of dashboardData.phases) {
      for (const activity of phase.activities) {
        await prisma.activity.create({
          data: {
            phase: activity.المرحلة,
            mainActivity: activity['النشاط الرئيسي'],
            subActivity: activity['النشاط الفرعي'],
            status: activity.الحالة,
            plannedStartDate: activity['تاريخ البدء المخطط'],
            plannedEndDate: activity['تاريخ الانتهاء المخطط'],
          },
        });
      }
    }
    
    console.log('✅ تم إدراج الأنشطة');

    // Insert support activities
    for (const activity of dashboardData.support.activities) {
      await prisma.supportActivity.create({
        data: {
          activity: activity['أعمال الدعم التشغيلي'],
          teamMember: activity['المسؤول من الفريق'],
          status: activity.الحالة,
          completionDate: activity['تاريخ الانتهاء'],
        },
      });
    }
    
    console.log('✅ تم إدراج أعمال الدعم');

    // Insert risks
    for (const risk of dashboardData.risks.risks_list) {
      await prisma.risk.create({
        data: {
          description: risk['المخاطر والتحديات'],
          type: risk.النوع,
          status: risk.الحالة,
          treatmentMechanism: risk['آليات المعالجة'],
        },
      });
    }
    
    console.log('✅ تم إدراج المخاطر والتحديات');

    // Print summary
    const totalRecords = {
      activities: await prisma.activity.count(),
      supportActivities: await prisma.supportActivity.count(),
      risks: await prisma.risk.count(),
      phaseSummaries: await prisma.phaseSummary.count(),
      dashboardSettings: await prisma.dashboardSettings.count(),
    };

    console.log('\n📊 ملخص البيانات المدرجة:');
    console.log(`- الأنشطة: ${totalRecords.activities}`);
    console.log(`- أعمال الدعم: ${totalRecords.supportActivities}`);
    console.log(`- المخاطر: ${totalRecords.risks}`);
    console.log(`- المراحل: ${totalRecords.phaseSummaries}`);
    console.log(`- الإعدادات: ${totalRecords.dashboardSettings}`);

  } catch (error) {
    console.error('❌ خطأ في عملية إدخال البيانات:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    console.log('🎉 تمت عملية إدخال البيانات بنجاح!');
  })
  .catch(async (e) => {
    console.error('💥 فشلت عملية إدخال البيانات:', e);
    process.exit(1);
  });
