const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const chapters = await prisma.chapter.findMany({ 
    include: { 
      content: true,
      mcqs: true
    } 
  });
  
  console.log(`\n✅ Total Chapters: ${chapters.length}\n`);
  
  chapters.forEach(ch => {
    console.log(`${ch.order}. ${ch.title}`);
    console.log(`   Subject: ${ch.subject} | Class: ${ch.classLevel}`);
    console.log(`   Topics: ${ch.content.length} | Questions: ${ch.mcqs.length}`);
    console.log();
  });
  
  const totalTopics = chapters.reduce((sum, ch) => sum + ch.content.length, 0);
  const totalQuestions = chapters.reduce((sum, ch) => sum + ch.mcqs.length, 0);
  
  console.log(`📊 Summary:`);
  console.log(`   Total Topics: ${totalTopics}`);
  console.log(`   Total Questions: ${totalQuestions}`);
  
  await prisma.$disconnect();
})();
