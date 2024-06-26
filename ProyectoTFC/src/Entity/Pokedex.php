<?php

namespace App\Entity;

use App\Repository\PokedexRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PokedexRepository::class)]
class Pokedex
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $NombrePokemon = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombrePokemon(): ?string
    {
        return $this->NombrePokemon;
    }

    public function setNombrePokemon(string $NombrePokemon): self
    {
        $this->NombrePokemon = $NombrePokemon;

        return $this;
    }
}
