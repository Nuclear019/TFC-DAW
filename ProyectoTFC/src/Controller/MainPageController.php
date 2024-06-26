<?php

namespace App\Controller;

use App\Entity\EquipoPokemon;
use App\Entity\User;
use App\Entity\Puntuaciones;
use App\Form\PokemonsType;
use App\Form\UserType;
use App\Repository\EquipoPokemonRepository;
use App\Repository\PuntuacionesRepository;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use mysqli_sql_exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class MainPageController extends AbstractController{
    private $em;

    public function __construct(EntityManagerInterface $em) 
    {
        $this->em=$em;
    }

    #[Route('/register' , name: 'app_register') ]
    public function register(Request $request ,UserPasswordHasherInterface $passwordHasher){
        $error = 0;
        try {
            $user = new User();
            $user->setFechaCreacion(new DateTime());
            $user->setRoles(['ROLE_USER']);
            $form = $this->createForm(UserType::class,$user);
            $form->handleRequest($request);
            if ($form->isSubmitted() && $form->isValid()) {
    
                $plaintextPassword = $form->get('password')->getData();
    
    
    
                $hashedPassword = $passwordHasher->hashPassword(
                    $user,$plaintextPassword
                );
               
    
    
                $this->em->persist($user);
                $this->em->flush();
    
    
                $equipo = new EquipoPokemon();
                $equipo->setIdEntrenador($user->getId());
    
    
                $equipo->setPokemon1("Bulbasaur");
                $equipo->setPokemon2("Charmander");
                $equipo->setPokemon3("Squirtle");
    
                
    
                $user->setPassword($hashedPassword);
                
                $this->em->persist($equipo);
                $this->em->flush();
    
    
                $puntos = new Puntuaciones();
                $puntos->setIdEntrenador($user->getId());
                $puntos->setPuntuacion(0);
    
                $this->em->persist($puntos);
                $this->em->flush();
    
    
                return $this->redirectToRoute('app_login',[
                    'user'=>$user]);
            }
        } catch (Exception $th) {
            $error = 1;
        }



        
       

        return $this->render('register.html.twig',[
            'form'=>$form->createView(),
            'error'=> $error
        ]);     
    }    
    

    #[Route('/game/{id}' , name: 'game' , methods:["GET"]) ]
    public function game(Security $security, AuthenticationUtils $authenticationUtils ,EquipoPokemonRepository $equipoPokemonRepository,PuntuacionesRepository $puntuacionesRepository, $id=null){

        $user=$security->getUser();
        $userID = $user ? $user->getId() : null;
        $equipoPokemon = $equipoPokemonRepository->getByIdEntrenador($userID);
        $puntuaciones = $puntuacionesRepository->getByIdEntrenador($userID);
        $puntuacion = $puntuaciones->getPuntuacion();

        $fecha = $user ? $user->getFechaCreacion() : null;
      

        return $this->render('game.html.twig',[
            'user'=>$user,
            'equipo'=>$equipoPokemon,
            'puntos'=>$puntuacion,
            'fecha'=> $fecha->format('Y-m-d')
        ]);     
    }

    #[Route('/equipo/{id}' , name: 'team' , methods:["GET","POST"]) ]
    public function modifyTeam(Request $request,Security $security ,EquipoPokemonRepository $equipoPokemonRepository, $id=null){
        $user=$security->getUser();
        $userID = $user ? $user->getId() : null;
        $equipoPokemon = $equipoPokemonRepository->getByIdEntrenador($userID);

        $form = $this->createForm(PokemonsType::class,$equipoPokemon);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            $pokemon1 = $form->get('pokemon1')->getData();
            $pokemon2 = $form->get('pokemon2')->getData();
            $pokemon3 = $form->get('pokemon3')->getData();

            $equipoPokemon->setPokemon1($pokemon1);
            $equipoPokemon->setPokemon2($pokemon2);
            $equipoPokemon->setPokemon3($pokemon3);
     
            
            $this->em->persist($equipoPokemon);
            $this->em->flush();
            

            return $this->redirectToRoute('game',[
                'user'=>$user,
                'equipo'=>$equipoPokemon
            ]
            );
            
        }     
        return $this->render('team.html.twig',[
            "form" => $form->createView(),
        ]);
    }
    #[Route('/pokedex' , name: 'pokedex' , methods:["GET"]) ]
    public function pokedex(){
        return $this->render('pokedex.html.twig',[

        ]);     
    }
}


?>