import { uniqueNamesGenerator, Config, adjectives, colors } from 'unique-names-generator';
import {Request, Response} from 'express'

class Public {
    login = async (req: Request,res: Response) => {

        const customConfig: Config = {
            dictionaries: [adjectives, colors],
            separator: '-',
            length: 2,
        };

        const shortName: string = uniqueNamesGenerator(customConfig);

        return res.status(200).json({name: shortName})
    }
}

export default new Public()