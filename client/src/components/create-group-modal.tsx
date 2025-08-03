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
import { Plus } from "lucide-react";

const createGroupSchema = z.object({
  name: z.string().min(1, "그룹 이름을 입력해주세요").max(50, "그룹 이름은 50자 이하여야 합니다"),
  description: z.string().max(500, "설명은 500자 이하여야 합니다").optional(),
  visibility: z.enum(["public", "private", "invite_only"]),
});

type CreateGroupForm = z.infer<typeof createGroupSchema>;

interface CreateGroupModalProps {
  children?: React.ReactNode;
}

export default function CreateGroupModal({ children }: CreateGroupModalProps) {
  const [open, setOpen] = useState(false);

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
            그룹 만들기
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>새 그룹 만들기</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-create-group">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>그룹 이름</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="예: 서울 라이더스" 
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
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="그룹에 대한 간단한 설명을 입력하세요"
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
                  <FormLabel>공개 설정</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-group-visibility">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">공개 그룹</SelectItem>
                      <SelectItem value="private">비공개 그룹</SelectItem>
                      <SelectItem value="invite_only">초대만 가능</SelectItem>
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
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-strava-orange text-white hover:bg-orange-600"
                disabled={createGroupMutation.isPending}
                data-testid="button-submit-group"
              >
                {createGroupMutation.isPending ? "생성 중..." : "그룹 만들기"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
