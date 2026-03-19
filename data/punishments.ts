export interface Punishment {
  id: string;
  infraction: string;
  punishment: string;
}

export const punishmentsData: Punishment[] = [
  { id: 'pun-1', infraction: 'COMBAT LOGGIN (CL)', punishment: '1500 MESES PRISÃO ADM + ADV' },
  { id: 'pun-2', infraction: 'INVASÃO DE ÁREA VERMELHA', punishment: '1000 MESES CAMISA/FORÇA + ADV' },
  { id: 'pun-3', infraction: 'RDM', punishment: '1000 MESES CAMISA/FORÇA + ADV' },
  { id: 'pun-4', infraction: 'TROLL / ANTI-RP', punishment: '400 MESES + ADV' },
  { id: 'pun-5', infraction: 'ABUSO DE BUG', punishment: '300 MESES' },
  { id: 'pun-6', infraction: 'VDM', punishment: '500 MESES PRISÃO ADM + ADV' },
  { id: 'pun-7', infraction: 'SAQUEAMENTO FORA DE AÇÃO', punishment: '300 MESES CAMISA/FORÇA + ADV' },
  { id: 'pun-8', infraction: 'QUEBRAR REGRA DE AÇÃO', punishment: 'ADV' },
  { id: 'pun-9', infraction: 'VIOLAR SAFEZONE', punishment: 'ADV' },
  { id: 'pun-10', infraction: 'CALL GOD EM AÇÃO', punishment: 'ADV' },
  { id: 'pun-11', infraction: 'COPYBAIT', punishment: '300 MESES CAMISA/FORÇA + ADV' },
  { id: 'pun-12', infraction: 'ASSALTO FORA DE HORA', punishment: '300 MESES CAMISA/FORÇA + ADV' },
  { id: 'pun-13', infraction: 'FUGA PARA SAFEZONE', punishment: '100 MESES + ADV' },
  { id: 'pun-14', infraction: 'FUZIL NO SUL', punishment: '250 MESES + BLACK LIST' },
  { id: 'pun-15', infraction: 'ROUBAR VTR LEGAL', punishment: 'ADV' },
  { id: 'pun-16', infraction: 'ROUBAR VEÍCULO EM ÁREA SAFE', punishment: 'ADV' },
  { id: 'pun-17', infraction: 'ANTI-AMOR À VIDA', punishment: 'ADV' },
  { id: 'pun-18', infraction: 'POWER GAMING', punishment: 'ADV' },
  { id: 'pun-19', infraction: 'DESRESPEITO À STAFF', punishment: 'ADV/DEPENDENDO DO CASO = BAN' },
  { id: 'pun-20', infraction: 'FORÇAR RP', punishment: '1000 MESES CAMISA/FORÇA + ADV' },
  { id: 'pun-21', infraction: 'BIND EM AÇÃO', punishment: '300 MESES' },
  { id: 'pun-22', infraction: 'META GAMING', punishment: '1000 MESES CAMISA/FORÇA + ADV' },
  { id: 'pun-23', infraction: 'RP MEDÍOCRE', punishment: '300 MESES ( PRIORIZAR PVP, NÃO RP)' },
  { id: 'pun-24', infraction: 'FLAMING EM SAFEZONE', punishment: '500 MESES PRISAO ADM' },
  { id: 'pun-25', infraction: 'DARK ROLEPLAY', punishment: 'BAN PERMANENTE' },
  { id: 'pun-26', infraction: 'CAIXA DOIS', punishment: 'BAN PERMANENTE (EXCETO DEVOL..)' },
  { id: 'pun-27', infraction: 'ALTERAÇÃO DE VALOR', punishment: 'BAN PERMANENTE' },
  { id: 'pun-28', infraction: 'ZARALHO NO DISCORD', punishment: 'BAN PERMANENTE ( CIDADE/DISCORD)' },
];
