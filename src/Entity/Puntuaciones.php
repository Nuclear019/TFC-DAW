<?php

namespace App\Entity;

use App\Repository\PuntuacionesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PuntuacionesRepository::class)]
class Puntuaciones
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $id_entrenador = null;

    #[ORM\Column]
    private ?int $puntuacion = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdEntrenador(): ?int
    {
        return $this->id_entrenador;
    }

    public function setIdEntrenador(int $id_entrenador): self
    {
        $this->id_entrenador = $id_entrenador;

        return $this;
    }

    public function getPuntuacion(): ?int
    {
        return $this->puntuacion;
    }

    public function setPuntuacion(int $puntuacion): self
    {
        $this->puntuacion = $puntuacion;

        return $this;
    }
}
