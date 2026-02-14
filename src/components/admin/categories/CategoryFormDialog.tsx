"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { clientFetch } from "@/lib/fetch/clientFetch";
import type { Category } from "@/components/types/category";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  mode: "create" | "edit";
  initial?: Category;
  onSuccess: () => void;
  trigger?: React.ReactNode;
};

export function CategoryFormDialog({
  mode,
  initial,
  onSuccess,
  trigger,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = useMemo(
    () => (mode === "create" ? "Create Category" : "Edit Category"),
    [mode],
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");
    setImage(initial?.image ?? "");
  }, [open, initial]);

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        image: image.trim() || null,
      };

      const res =
        mode === "create"
          ? await clientFetch("api/categories", {
              method: "POST",
              body: JSON.stringify(payload),
            })
          : await clientFetch(`api/categories/${initial?.id}`, {
              method: "PATCH",
              body: JSON.stringify(payload),
            });

      if (res.error) throw new Error(res.error.message);

      toast.success(
        mode === "create" ? "Category created" : "Category updated",
      );
      setOpen(false);
      onSuccess();
    } catch (e: any) {
      toast.error(e?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant={mode === "create" ? "default" : "outline"} size="sm">
            {mode === "create" ? "Add Category" : "Edit"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
