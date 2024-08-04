<?php

namespace App\Repository;

use App\Entity\Puntuaciones;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Puntuaciones>
 *
 * @method Puntuaciones|null find($id, $lockMode = null, $lockVersion = null)
 * @method Puntuaciones|null findOneBy(array $criteria, array $orderBy = null)
 * @method Puntuaciones[]    findAll()
 * @method Puntuaciones[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PuntuacionesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Puntuaciones::class);
    }

    public function save(Puntuaciones $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Puntuaciones $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    public function getByIdEntrenador($idEntrenador): ?Puntuaciones
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.id_entrenador = :val')
            ->setParameter('val', $idEntrenador)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
//    /**
//     * @return Puntuaciones[] Returns an array of Puntuaciones objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Puntuaciones
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
