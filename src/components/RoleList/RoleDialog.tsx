'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Role, RoleFormValues } from '@/types/role';

const formSchema = z.object({
  rolename: z.string().min(1, {
    message: 'roleList.form.rolename.required',
  }),
});

interface RoleDialogProps {
  open: boolean;
  role?: Role;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RoleFormValues) => Promise<void>;
}

export function RoleDialog({ open, role, onOpenChange, onSubmit }: RoleDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rolename: '',
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        rolename: role.rolename,
      });
    } else {
      form.reset({
        rolename: '',
      });
    }
  }, [role, form]);

  const handleSubmit = async (data: RoleFormValues) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        description: t('roleList.dialog.error'),
      });
      console.error('Failed to submit role:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {role ? t('roleList.dialog.editTitle') : t('roleList.dialog.createTitle')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rolename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('roleList.form.rolename.label')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('roleList.form.rolename.placeholder')} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.rolename &&
                      t(form.formState.errors.rolename.message as string)}
                  </FormMessage>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('common.loading') : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
