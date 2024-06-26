<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230613150900 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE equipo_pokemon DROP FOREIGN KEY equipo_pokemon_ibfk_1');
        $this->addSql('DROP INDEX id_entrenador ON equipo_pokemon');
        $this->addSql('ALTER TABLE equipo_pokemon ADD pokemon2 VARCHAR(255) NOT NULL, ADD pokemon3 VARCHAR(255) NOT NULL, CHANGE nombre_pokemon pokemon1 VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE equipo_pokemon ADD nombre_pokemon VARCHAR(255) NOT NULL, DROP pokemon1, DROP pokemon2, DROP pokemon3');
        $this->addSql('ALTER TABLE equipo_pokemon ADD CONSTRAINT equipo_pokemon_ibfk_1 FOREIGN KEY (id_entrenador) REFERENCES user (id)');
        $this->addSql('CREATE INDEX id_entrenador ON equipo_pokemon (id_entrenador)');
    }
}
