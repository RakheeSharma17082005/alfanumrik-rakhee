const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const topic = await prisma.chapterContent.findFirst({ 
    where: { topic: 'Nutrition in Plants' } 
  });
  
  console.log('\n✅ Multimedia Content Verification:\n');
  console.log('Topic:', topic.topic);
  console.log('Diagram Title:', topic.diagramTitle);
  console.log('Chart Title:', topic.chartTitle);
  console.log('YouTube Video:', topic.youtubeUrl ? 'YES' : 'NO');
  console.log('Key Points:', topic.keyPoints ? JSON.parse(topic.keyPoints).length + ' points' : 'None');
  console.log('Resources:', topic.resources ? JSON.parse(topic.resources).length + ' external links' : 'None');
  
  console.log('\n📊 Key Learning Points:');
  if (topic.keyPoints) {
    JSON.parse(topic.keyPoints).forEach((point, i) => {
      console.log(`   ${i + 1}. ${point}`);
    });
  }
  
  console.log('\n🔗 External Resources:');
  if (topic.resources) {
    JSON.parse(topic.resources).forEach((res, i) => {
      console.log(`   ${i + 1}. ${res.title}`);
    });
  }
  
  await prisma.$disconnect();
})();
