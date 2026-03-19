const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Configurações do Bot
const TOKEN = 'COLE_SEU_TOKEN_AQUI'; // Substitua pelo Token do seu Bot
const APP_URL = 'https://ais-pre-acdtmclb2o4ezxvhubvphc-214590200011.us-east1.run.app'; // Link do nosso site

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log(`✅ Bot logado com sucesso como ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  // Ignora mensagens de outros bots
  if (message.author.bot) return;

  // Comando para gerar o painel no Discord
  if (message.content === '!painel') {
    // Cria a mensagem visual (Embed)
    const embed = new EmbedBuilder()
      .setColor('#6366f1') // Cor Indigo (combinando com o site)
      .setTitle('📚 Sistema de Regras e Comandos - Vice City')
      .setDescription('Acesse nosso painel oficial para consultar todas as informações da cidade.\n\n**O que você encontra no painel:**\n💻 Lista de Comandos\n📖 Regras da Cidade\n⚖️ Tabela de Punições\n🤖 Assistente de IA para tirar dúvidas')
      .setFooter({ text: 'Vice City Roleplay • Sistema Oficial' });

    // Cria o botão que leva para o site
    const button = new ButtonBuilder()
      .setLabel('Acessar Painel Oficial')
      .setURL(APP_URL)
      .setStyle(ButtonStyle.Link)
      .setEmoji('🌐');

    const row = new ActionRowBuilder().addComponents(button);

    // Envia a mensagem no canal
    await message.channel.send({ embeds: [embed], components: [row] });
    
    // Apaga o comando '!painel' que o admin digitou para o chat ficar limpo
    await message.delete().catch(() => {});
  }
});

client.login(TOKEN);
