// pages/api/get-sheets-data.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
}