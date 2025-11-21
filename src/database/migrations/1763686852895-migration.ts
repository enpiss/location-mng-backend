import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763686852895 implements MigrationInterface {
    name = 'Migration1763686852895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "address" character varying NOT NULL, "description" character varying, "rentAmount" numeric(10,2) NOT NULL, "rentDueDay" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "ownerId" uuid NOT NULL, CONSTRAINT "PK_919e3b3d97440c6ff0545a19050" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."echeances_loyer_status_enum" AS ENUM('DUE', 'PARTIAL', 'PAID')`);
        await queryRunner.query(`CREATE TABLE "echeances_loyer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "monthKey" character varying(7) NOT NULL, "amountDue" numeric(10,2) NOT NULL, "amountPaid" numeric(10,2) NOT NULL DEFAULT '0', "status" "public"."echeances_loyer_status_enum" NOT NULL DEFAULT 'DUE', "locataireId" uuid, CONSTRAINT "PK_c21024ba0d1b576c99de9811f5e" PRIMARY KEY ("id")); COMMENT ON COLUMN "echeances_loyer"."monthKey" IS 'Format YYYY-MM'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_74f4e1e0010be0f5b73c2d6a8c" ON "echeances_loyer" ("locataireId", "monthKey") `);
        await queryRunner.query(`CREATE TABLE "affectations_paiement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "amount" numeric(10,2) NOT NULL, "echeanceLoyerId" uuid NOT NULL, "paiementId" uuid NOT NULL, CONSTRAINT "PK_00e9f54b534013cb0b45d6cef17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "paiements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "amount" numeric(10,2) NOT NULL, "paidAt" date NOT NULL, "monthKey" character varying(7) NOT NULL, "note" character varying, "locataireId" uuid NOT NULL, CONSTRAINT "PK_d7a1e0ef2ae0e3a50cc4f41c35e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "locataires" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "fullName" character varying NOT NULL, "phone" character varying, "email" character varying, "startDate" date, "endDate" date, "proprietaireId" uuid, "logementId" uuid, CONSTRAINT "UQ_1c38a8eb24d5693818bc7a9163b" UNIQUE ("phone"), CONSTRAINT "UQ_290ff7f837aac291a44a03569f9" UNIQUE ("email"), CONSTRAINT "PK_4c91086d33b266f1173f0a8893e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "fullName" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "logements" ADD CONSTRAINT "FK_a8df9ffb404626341899542c4a5" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "echeances_loyer" ADD CONSTRAINT "FK_b72be55be9a161b70b8095c79f8" FOREIGN KEY ("locataireId") REFERENCES "locataires"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "affectations_paiement" ADD CONSTRAINT "FK_178e7f5bbfcbf3fd79aa2db001e" FOREIGN KEY ("echeanceLoyerId") REFERENCES "echeances_loyer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "affectations_paiement" ADD CONSTRAINT "FK_81700ba77923b110ab5ecdef4e7" FOREIGN KEY ("paiementId") REFERENCES "paiements"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "paiements" ADD CONSTRAINT "FK_9bf89688023a0a45df0806df1a5" FOREIGN KEY ("locataireId") REFERENCES "locataires"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locataires" ADD CONSTRAINT "FK_fd741f44bd5cd77e6701f1ec34f" FOREIGN KEY ("proprietaireId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locataires" ADD CONSTRAINT "FK_26694ae521cb4b056801d457727" FOREIGN KEY ("logementId") REFERENCES "logements"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locataires" DROP CONSTRAINT "FK_26694ae521cb4b056801d457727"`);
        await queryRunner.query(`ALTER TABLE "locataires" DROP CONSTRAINT "FK_fd741f44bd5cd77e6701f1ec34f"`);
        await queryRunner.query(`ALTER TABLE "paiements" DROP CONSTRAINT "FK_9bf89688023a0a45df0806df1a5"`);
        await queryRunner.query(`ALTER TABLE "affectations_paiement" DROP CONSTRAINT "FK_81700ba77923b110ab5ecdef4e7"`);
        await queryRunner.query(`ALTER TABLE "affectations_paiement" DROP CONSTRAINT "FK_178e7f5bbfcbf3fd79aa2db001e"`);
        await queryRunner.query(`ALTER TABLE "echeances_loyer" DROP CONSTRAINT "FK_b72be55be9a161b70b8095c79f8"`);
        await queryRunner.query(`ALTER TABLE "logements" DROP CONSTRAINT "FK_a8df9ffb404626341899542c4a5"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "locataires"`);
        await queryRunner.query(`DROP TABLE "paiements"`);
        await queryRunner.query(`DROP TABLE "affectations_paiement"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74f4e1e0010be0f5b73c2d6a8c"`);
        await queryRunner.query(`DROP TABLE "echeances_loyer"`);
        await queryRunner.query(`DROP TYPE "public"."echeances_loyer_status_enum"`);
        await queryRunner.query(`DROP TABLE "logements"`);
    }

}
