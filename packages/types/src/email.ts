export function isPlainEmail(email: string): boolean {
    if (email.length > 254) return false;
    const at = email.indexOf('@');
    if (at <= 0 || email.lastIndexOf('@') !== at) return false;
    const local = email.slice(0, at);
    const domain = email.slice(at + 1);
    const dot = domain.lastIndexOf('.');
    if (dot <= 0 || dot === domain.length - 1) return false;
    const ok = (part: string) => part.length > 0 && ![...part].some((ch) => ch === ' ' || ch === '\t');
    return ok(local) && ok(domain);
}
