# Database Migrations & SQL Scripts

Direktori ini mengandungi skrip SQL dan polisi Row Level Security (RLS) untuk pangkalan data Supabase bagi **Dashboard ADTEC Melaka**.

## Senarai Skrip:

### Polisi & Keselamatan (RLS):
- `admin_profiles_policy.sql` - Polisi capaian jadual profil pengguna untuk pentadbir.
- `admin_items_policy.sql` - Polisi semakan dan pengurusan item laporan untuk pentadbir.
- `fix_delete_policy.sql` - Memperbaiki hak kebenaran pemadaman item.
- `fix_update_policy.sql` - Memperbaiki polisi kemaskini status item.
- `fix_messages_update_policy.sql` - Kebenaran kemaskini mesej (tanda dibaca/is_read).
- `fix_storage_policy.sql` - Kebenaran muat naik dan capaian fail dalam Supabase Storage bucket.

### Struktur Jadual & Kolum (Schema):
- `create_audit_logs_table.sql` - Mencipta jadual log audit aktiviti pentadbir dan sistem.
- `add_profile_features.sql` - Menambah kolum sokongan profil pengguna.
- `add_report_image_column.sql` - Menambah kolum imej bukti untuk laporan.
- `add_is_read_column.sql` - Menambah kolum status dibaca untuk mesej.
- `add_suspended_until_column.sql` - Menambah kolum tempoh penggantungan akaun pengguna.
- `fix_trigger.sql` - Fungsi trigger pendaftaran automatik pengguna ke jadual profiles.
