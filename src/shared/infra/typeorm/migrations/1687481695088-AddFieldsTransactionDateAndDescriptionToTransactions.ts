import { type MigrationInterface, type QueryRunner, TableColumn } from "typeorm"

export default class AddFieldsTransactionDateAndDescriptionToTransactions1687481695088 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumns(
        'transactions',
        [
          new TableColumn({
            name: 'transaction_date',
            type: 'timestamp'
          }),
          new TableColumn({
            name: 'description',
            type: 'varchar',
            isNullable: true
          })
        ]
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumns(
        'transactions',
        ['transaction_date', 'description']
      );
    }

}
