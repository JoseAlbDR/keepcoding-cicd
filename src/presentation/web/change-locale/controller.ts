import { Request, Response } from 'express';

export class ChangeLocaleController {
  constructor() {}

  translate = (req: Request, res: Response) => {
    const { locale } = req.params;

    const oneWeek = 1000 * 60 * 60 * 24 * 7;

    res.cookie('nodepop-locale', locale, {
      maxAge: oneWeek,
    });

    res.redirect(req.get('referer')!);
  };
}
