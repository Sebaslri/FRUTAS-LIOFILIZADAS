<?php

declare(strict_types=1);

class AuthController
{
    private Auth $model;

    public function __construct(Auth $model)
    {
        $this->model = $model;
    }

    public function login(array $body): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(false, null, 'Metodo no permitido.', 405);
        }

        $email = trim((string) ($body['email'] ?? $body['correo'] ?? $_POST['email'] ?? $_POST['correo'] ?? ''));
        $password = (string) ($body['password'] ?? $body['contrasena'] ?? $_POST['password'] ?? $_POST['contrasena'] ?? '');

        if ($email === '' || $password === '') {
            $this->respond(false, null, 'Email y password son obligatorios.', 422);
        }

        $user = $this->model->findByEmail($email);

        if ($user !== null) {
            $storedPassword = (string) ($user['password'] ?? '');

            if ($password === $storedPassword || password_verify($password, $storedPassword)) {
                unset($user['password']);
                $this->setSession($user);
                $this->respond(true, $user, 'Inicio de sesion correcto.');
            }
        }

        $this->respond(false, null, 'Credenciales incorrectas.', 401);
    }

    public function register(array $body): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(false, null, 'Metodo no permitido.', 405);
        }

        $nombre = trim((string) ($body['nombre'] ?? $_POST['nombre'] ?? ''));
        $apellido = trim((string) ($body['apellido'] ?? $_POST['apellido'] ?? ''));
        $email = trim((string) ($body['email'] ?? $body['correo'] ?? $_POST['email'] ?? $_POST['correo'] ?? ''));
        $password = (string) ($body['password'] ?? $body['contrasena'] ?? $_POST['password'] ?? $_POST['contrasena'] ?? '');

        if ($nombre === '' || $apellido === '' || $email === '' || $password === '') {
            $this->respond(false, null, 'Todos los campos son obligatorios.', 422);
        }

        if ($this->model->emailExists($email)) {
            $this->respond(false, null, 'El correo ya esta registrado.', 409);
        }

        $foto = null;
        if (isset($_FILES['foto'])) {
            require_once __DIR__ . '/../../helpers/UploadHelper.php';
            $foto = handleAvatarUpload($_FILES['foto']);
        }

        $user = $this->model->create([
            'nombre' => $nombre,
            'apellido' => $apellido,
            'email' => $email,
            'password' => $password,
            'foto' => $foto
        ]);

        $this->setSession($user);
        $this->respond(true, $user, 'Usuario registrado correctamente.', 201);
    }

    public function logout(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(false, null, 'Metodo no permitido.', 405);
        }

        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }

        session_destroy();
        $this->respond(true, null, 'Sesion cerrada correctamente.');
    }

    private function setSession(array $user): void
    {
        $_SESSION['usuarioId'] = $user['usuarioId'];
        $_SESSION['nombre'] = $user['nombre'];
        $_SESSION['rolId'] = $user['rolId'];
    }

    private function respond(bool $isSuccess, mixed $data, string $message, int $statusCode = 200): void
    {
        apiResponse($isSuccess, $data, $message, $statusCode, [
            'success' => $isSuccess,
            'user' => $data,
        ]);
    }
}
