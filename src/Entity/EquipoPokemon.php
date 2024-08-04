<?php

namespace App\Entity;

use App\Repository\EquipoPokemonRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EquipoPokemonRepository::class)]
class EquipoPokemon
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $id_entrenador = null;

    #[ORM\Column(length: 255)]
    private ?string $pokemon1 = null;

    #[ORM\Column(length: 255)]
    private ?string $pokemon2 = null;

    #[ORM\Column(length: 255)]
    private ?string $pokemon3 = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdEntrenador(): ?int
    {
        return $this->id_entrenador;
    }

    public function setIdEntrenador(int $idEntrenador): self
    {
        $this->id_entrenador = $idEntrenador;

        return $this;
    }

    public function getPokemon1(): ?string
    {
        return $this->pokemon1;
    }

    public function setPokemon1(string $pokemon1): self
    {
        $this->pokemon1 = $pokemon1;

        return $this;
    }

    public function getPokemon2(): ?string
    {
        return $this->pokemon2;
    }

    public function setPokemon2(string $pokemon2): self
    {
        $this->pokemon2 = $pokemon2;

        return $this;
    }

    public function getPokemon3(): ?string
    {
        return $this->pokemon3;
    }

    public function setPokemon3(string $pokemon3): self
    {
        $this->pokemon3 = $pokemon3;

        return $this;
    }

}
