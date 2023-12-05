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

export const getData = () => JSON.parse(fs.readFileSync('./data.json', 'utf-8')) as BotData;

export const setData = (data: BotData) => fs.writeFileSync('./data.json', JSON.stringify(data));