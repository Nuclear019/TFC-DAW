<?php

namespace App\Repository;

use App\Entity\EquipoPokemon;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<EquipoPokemon>
 *
 * @method EquipoPokemon|null find($id, $lockMode = null, $lockVersion = null)
 * @method EquipoPokemon|null findOneBy(array $criteria, array $orderBy = null)
 * @method EquipoPokemon[]    findAll()
 * @method EquipoPokemon[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EquipoPokemonRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EquipoPokemon::class);
    }

    public function save(EquipoPokemon $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(EquipoPokemon $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

   
//    public function getByIdEntrenador($idEntrenador)
//       {
//        return $this->createQueryBuilder('e')
//            ->andWhere('e.id_entrenador = :val')
//            ->setParameter('val', $idEntrenador)
//            ->orderBy('e.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

   public function getByIdEntrenador($idEntrenador): ?EquipoPokemon
   {
       return $this->createQueryBuilder('e')
           ->andWhere('e.id_entrenador = :val')
           ->setParameter('val', $idEntrenador)
           ->getQuery()
           ->getOneOrNullResult()
       ;
   }
}
