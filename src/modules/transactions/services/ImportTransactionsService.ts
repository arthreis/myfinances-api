import * as csvParse from 'csv-parse';
import fs from 'fs';
import { In } from 'typeorm';
import Transaction from '../entities/Transaction';
import { TransactionsRepository } from '../repositories/TransactionsRepository';
import Category from '../../categories/entities/Category';
import { dataSource } from '../../../shared/infra/typeorm/config/datasources/ormconfig';

interface Request {
  user_id: string;
  path: string;
}

interface ImportData {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_name: string;
}
class ImportTransactionsService {
  async execute({ user_id, path }: Request): Promise<Transaction[]> {

    const categoryRepository = dataSource.getRepository(Category);
    const readCSVStream = fs.createReadStream(path);
    const parseStream = csvParse.parse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: string[] = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise((resolve, _) => {
      parseCSV.on('end', resolve);
    });

    const categories: string[] = [];
    const transactions: ImportData[] = [];

    lines.forEach(line => {
      transactions.push({
        title: line[0],
        type: line[1] as 'income' | 'outcome',
        value: parseFloat(line[2]),
        category_name: line[3],

      });

      if (!categories.includes(line[3])) categories.push(line[3]);
    });

    const existentCategories = await categoryRepository.find({
      where: {
        title: In(categories),
      },
    });

    const mapExistentCategories = existentCategories.reduce(
      (acc: Record<string, string>, curr: Category) => {
        acc[curr.title] = curr.id;
        return acc;
      },
      {} as Record<string, string>,
    );

    const categoriesToAdd = categories.filter(
      category => !(category in mapExistentCategories),
    );

    const newCategories = categoryRepository.create(
      categoriesToAdd.map(category => ({
        user_id,
        title: category,
        icon: 'fa/FaAsterisk',
        color: '#363f5f',
      })),
    );

    await categoryRepository.save(newCategories);

    const transactionsToCreate = transactions.map((transaction: {title: string; type: 'income'|'outcome';value:number;category_name:string}) => {
      let categoryId = '';
      if (mapExistentCategories[transaction.category_name]) {
        categoryId = mapExistentCategories[transaction.category_name];
      } else {
        const found = newCategories.find(
          category => category.title === transaction.category_name,
        );
        if (found) categoryId = found.id;
      }

      return {
        user_id,
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category_id: categoryId,
      };
    });

    const createdTransactions = TransactionsRepository.create(
      transactionsToCreate,
    );

    await TransactionsRepository.save(createdTransactions);

    await fs.promises.unlink(path);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
