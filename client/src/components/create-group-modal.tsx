import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";
import { Plus } from "lucide-react";

interface CreateGroupModalProps {
  children?: React.ReactNode;
}

export default function CreateGroupModal({ children }: CreateGroupModalProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const createGroupSchema = z.object({
    name: z.string().min(1, "Group name is required").max(50, "Group name must be under 50 characters"),
    description: z.string().max(500, "Description must be under 500 characters").optional(),
    visibility: z.enum(["public", "private", "invite_only"]),
  });

  type CreateGroupForm = z.infer<typeof createGroupSchema>;

  const form = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      visibility: "public",
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: (data: CreateGroupForm) => apiRequest("POST", "/api/groups", data),
    onSuccess: () => {
      toast({ title: "그룹 생성 성공", description: "새 그룹이 성공적으로 생성되었습니다." });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "그룹 생성 실패", description: "그룹 생성에 실패했습니다.", variant: "destructive" });
    },
  });

  const onSubmit = (data: CreateGroupForm) => {
    createGroupMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full bg-strava-orange text-white hover:bg-orange-600" data-testid="button-create-group">
            <Plus className="h-4 w-4 mr-2" />
            {t("groups.createGroup")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("createGroup.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-create-group">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("createGroup.name")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t("createGroup.namePlaceholder")} 
                      {...field} 
                      data-testid="input-group-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("createGroup.description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("createGroup.descriptionPlaceholder")}
                      className="h-24"
                      {...field}
                      data-testid="input-group-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("createGroup.visibility")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-group-visibility">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">{t("groups.public")} Group</SelectItem>
                      <SelectItem value="private">{t("groups.private")} Group</SelectItem>
                      <SelectItem value="invite_only">{t("groups.inviteOnly")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
                data-testid="button-cancel-group"
              >
                {t("createGroup.cancel")}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-strava-orange text-white hover:bg-orange-600"
                disabled={createGroupMutation.isPending}
                data-testid="button-submit-group"
              >
                {createGroupMutation.isPending ? t("createGroup.creating") : t("createGroup.create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
