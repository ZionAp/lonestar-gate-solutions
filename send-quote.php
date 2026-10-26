<?php
declare(strict_types=1);
ini_set('display_errors', '0');

const MAIL_TO = 'lonestargatesrepair@gmail.com';
const MAIL_FROM = 'no-reply@lonestargate.com';
const SITE_NAME = 'LoneStar Gate Solutions';
const MAX_BODY_BYTES = 20000;
const RATE_LIMIT = 5;
const RATE_WINDOW = 900;

function wants_json(): bool
{
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $requestedWith = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';

    return strpos($accept, 'application/json') !== false || $requestedWith === 'XMLHttpRequest';
}

function finish(int $status, array $payload, bool $jsonOnly = false): void
{
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');

    if ($jsonOnly || wants_json()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Vary: Accept');
        echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    $ok = !empty($payload['ok']);
    header('Location: /index.html?quote=' . ($ok ? 'sent' : 'error') . '#contact', true, 303);
    exit;
}

function input_value(string $key): string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        return '';
    }

    $clean = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
    return trim(is_string($clean) ? $clean : '');
}

function single_line(string $value): string
{
    $clean = preg_replace('/\s+/u', ' ', $value);
    return trim(is_string($clean) ? $clean : '');
}

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function text_slice(string $value, int $limit): string
{
    return function_exists('mb_substr') ? mb_substr($value, 0, $limit, 'UTF-8') : substr($value, 0, $limit);
}

function allows_quote(string $ip): bool
{
    $file = sys_get_temp_dir() . '/lsgs-quote-' . hash('sha256', $ip);
    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        return true;
    }

    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        return true;
    }

    $now = time();
    $hits = [];
    $stored = stream_get_contents($handle);

    if (is_string($stored) && $stored !== '') {
        $decoded = json_decode($stored, true);
        if (is_array($decoded)) {
            foreach ($decoded as $hit) {
                if (is_int($hit) && $hit > $now - RATE_WINDOW) {
                    $hits[] = $hit;
                }
            }
        }
    }

    if (count($hits) >= RATE_LIMIT) {
        flock($handle, LOCK_UN);
        fclose($handle);
        return false;
    }

    $hits[] = $now;
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($hits));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return true;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    finish(405, ['ok' => false, 'message' => 'Method not allowed.'], true);
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > MAX_BODY_BYTES) {
    finish(413, ['ok' => false, 'message' => 'Request is too large.']);
}

$honeypot = single_line(input_value('company'));
if ($honeypot !== '') {
    finish(200, ['ok' => true, 'message' => 'Thank you! Your quote request has been sent. We will contact you within 24 hours.']);
}

$name = single_line(input_value('name'));
$phone = single_line(input_value('phone'));
$email = single_line(input_value('email'));
$service = single_line(input_value('service'));
$address = single_line(input_value('address'));
$message = input_value('message');

$services = [
    'installation' => 'Gate Installation',
    'repair' => 'Gate Repair',
    'sales' => 'Gate Sales/Equipment',
    'access' => 'Access Control',
    'welding' => 'Welding/Fabrication',
    'other' => 'Other'
];

$errors = [];
$phoneDigits = preg_replace('/\D+/', '', $phone);

if (text_length($name) < 2 || text_length($name) > 100) {
    $errors[] = 'Please enter a valid name.';
}

if (!is_string($phoneDigits) || strlen($phoneDigits) < 7 || strlen($phoneDigits) > 15 || text_length($phone) > 25) {
    $errors[] = 'Please enter a valid phone number.';
}

if ($email !== '' && (!filter_var($email, FILTER_VALIDATE_EMAIL) || text_length($email) > 200)) {
    $errors[] = 'Please enter a valid email address.';
}

if (!isset($services[$service])) {
    $errors[] = 'Please choose a valid service.';
}

if (text_length($address) > 150) {
    $errors[] = 'Property address is too long.';
}

if (text_length($message) > 1000) {
    $errors[] = 'Project details are too long.';
}

if ($errors !== []) {
    finish(422, ['ok' => false, 'message' => implode(' ', $errors)]);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!is_string($ip) || filter_var($ip, FILTER_VALIDATE_IP) === false) {
    $ip = 'unknown';
}

if (!allows_quote($ip)) {
    finish(429, ['ok' => false, 'message' => 'Too many requests. Please wait a few minutes and try again, or call (737) 265-4627.']);
}

$serviceLabel = $services[$service];
$safeSubjectName = text_slice($name, 60);
$subject = 'New quote request: ' . $serviceLabel . ' - ' . $safeSubjectName;

$body = implode("\n", [
    'New quote request from ' . SITE_NAME,
    '',
    'Name: ' . $name,
    'Phone: ' . $phone,
    'Email: ' . ($email !== '' ? $email : 'Not provided'),
    'Service: ' . $serviceLabel,
    'Property address: ' . ($address !== '' ? $address : 'Not provided'),
    '',
    'Project details:',
    ($message !== '' ? $message : 'Not provided'),
    '',
    'Submitted: ' . gmdate('Y-m-d H:i:s') . ' UTC',
    'IP: ' . $ip
]);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . SITE_NAME . ' <' . MAIL_FROM . '>',
    'Reply-To: ' . ($email !== '' ? $email : MAIL_TO),
    'X-Mailer: PHP/' . phpversion()
];

$sent = @mail(MAIL_TO, $subject, $body, implode("\r\n", $headers), '-f' . MAIL_FROM);

if (!$sent) {
    error_log('LoneStar Gate quote form mail() failed for ' . $phoneDigits);
    finish(500, ['ok' => false, 'message' => 'We could not send your request right now. Please call (737) 265-4627 or email lonestargatesrepair@gmail.com.']);
}

finish(200, ['ok' => true, 'message' => 'Thank you ' . $name . '! Your quote request has been sent. We will contact you at ' . $phone . ' within 24 hours.']);
