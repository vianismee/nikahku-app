"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import { logout } from "@/app/actions/auth";
import { toast } from "sonner";
import { Loader2, Lock, LogOut, Trash2, AlertTriangle } from "lucide-react";

export function AccountSettings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Password baru tidak cocok");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setChangingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast.success("Password berhasil diubah");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Gagal mengubah password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Ubah Password</CardTitle>
          <CardDescription>
            Perbarui password untuk menjaga keamanan akun
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">
              <Lock className="h-3.5 w-3.5 inline mr-1.5" />
              Password Baru
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              <Lock className="h-3.5 w-3.5 inline mr-1.5" />
              Konfirmasi Password Baru
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
            />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={changingPassword || !newPassword || !confirmPassword}
            className="gap-1.5"
          >
            {changingPassword ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Ubah Password
          </Button>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card>
        <CardHeader>
          <CardTitle>Sesi</CardTitle>
          <CardDescription>Keluar dari akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={logout}>
            <Button variant="outline" type="submit" className="gap-1.5">
              <LogOut className="h-4 w-4" />
              Keluar dari Akun
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Zona Berbahaya</CardTitle>
          <CardDescription>
            Tindakan ini tidak dapat dibatalkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Hapus Akun</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Menghapus akun akan menghapus semua data pernikahan, vendor,
                  budget, tamu, dan semua data lainnya secara permanen.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-3 gap-1.5"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus Akun
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Hapus Akun</DialogTitle>
            <DialogDescription>
              Tindakan ini akan menghapus semua data Anda secara permanen dan
              tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm">
              Ketik <strong>HAPUS AKUN</strong> untuk mengonfirmasi:
            </p>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="HAPUS AKUN"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirm("");
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirm !== "HAPUS AKUN"}
              onClick={async () => {
                toast.info(
                  "Fitur hapus akun memerlukan konfigurasi server. Hubungi admin untuk menghapus akun."
                );
                setShowDeleteDialog(false);
                setDeleteConfirm("");
              }}
            >
              Hapus Akun
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
