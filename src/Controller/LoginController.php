<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController extends AbstractController
{
    #[Route('/', name: 'app_login')]
    public function index(AuthenticationUtils $authenticationUtils, Security $security)  : Response
    {
        $user = $security->getUser();

        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();
        $userID = $user ? $user->getId() : null;
        return $this->render('login.html.twig', [
            'last_username' => $lastUsername,
            'error'         => $error,
            'userID'=> $userID
        ]);
    }


    #[Route('/logout', name: 'app_logout')]
    public function logout(): Void
    {
        
        
    }
}
