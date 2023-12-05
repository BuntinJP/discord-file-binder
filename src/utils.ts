import fs from 'fs';
import { BotData } from './types';
import { Attachment, Collection } from 'discord.js';
//Collection<string, Attachment>

type Attachments = Collection<string, Attachment>;

const resolveFilename = (dataDir: string, key: string): string => {
  const path = `${ dataDir }/${ key }`;
  if (!fs.existsSync(path)) {
    const filename = key.split('.')[0];
    const ext = key.split('.')[-1];
    return `${ dataDir }/${ filename }-${ Date.now() }.${ ext }`;
  }
  return path;
}

export const saveAttachmentIntoDataDir = async (attachments: Attachments, dataDir: string) => {
  const results = attachments.map(async (attachment, key) => {
    const buffer = await (await fetch(attachment.url)).arrayBuffer();
    const filepath = resolveFilename(dataDir, key);
    fs.writeFileSync(filepath, buffer);
    return filepath;
  });
  return Promise.all(results);
};

export const checkChannelId = (channelId: string) => {
  const { monitors } = getData();
  const ids = monitors.map(monitor => monitor.channelId);
  return ids.includes(channelId);
}

const jsonFilename = Bun.env.BOT_DATA ?? '';
const getData = () => JSON.parse(fs.readFileSync(jsonFilename, 'utf-8')) as BotData;

const setData = (data: BotData) => fs.writeFileSync(jsonFilename, JSON.stringify(data));

export const getIds = () => getData().monitors.map(monitor => monitor.channelId);

export const addMonitor = (name: string, id: string) => {
  const data = getData();
  if (data.monitors.map(monitor => monitor.channelId).includes(id)) return false;
  data.monitors.push({ name, channelId: id });
  setData(data);
  return true;
}

export const removeMonitor = (id: string) => {
  const ifIncludes = getIds().includes(id);
  const data = getData();
  data.monitors = data.monitors.filter(monitor => monitor.channelId !== id);
  setData(data);
  return ifIncludes;
}

export const getAvailableChannels = () => {
  const ids = getIds();
  const message = `Now monitoring channels \n ${ ids.map(id => `<#${ id }>`).join('\n') }`;
  return message;
}
