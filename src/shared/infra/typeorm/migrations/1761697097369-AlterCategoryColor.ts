import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterCategoryColor1761697097369 implements MigrationInterface {
    name = 'AlterCategoryColor1761697097369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn("categories", "background_color_light", "color");
        await queryRunner.dropColumn("categories", "background_color_dark");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('categories', [
              new TableColumn({
                name: 'background_color_dark',
                type: 'varchar',
              }),
            ]);
        await queryRunner.renameColumn("categories", "color", "background_color_light");
    }

}
