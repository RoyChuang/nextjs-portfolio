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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Role } from '@/types/role';
import { User, UserFormValues } from '@/types/user';

// 表單驗證 schema
const formSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    roleId: z.string().min(1, 'Role is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    passwordConfirm: z.string(),
  })
  .refine(
    (data) => {
      // 確保密碼匹配
      return data.password === data.passwordConfirm;
    },
    {
      message: "Passwords don't match",
      path: ['passwordConfirm'],
    }
  );

// 編輯時使用的 schema
const editFormSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    roleId: z.string().min(1, 'Role is required'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional()
      .or(z.literal('')),
    passwordConfirm: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (!data.password || data.password === '') return true;
      return data.password === data.passwordConfirm;
    },
    {
      message: "Passwords don't match",
      path: ['passwordConfirm'],
    }
  );

type FormValues = z.infer<typeof formSchema>;

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormValues) => void;
  defaultValues?: User;
  roles?: Role[];
}

export function UserDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  roles = [],
}: UserDialogProps) {
  const { t } = useTranslation();
  const isEditing = !!defaultValues;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(isEditing ? editFormSchema : formSchema),
    defaultValues: {
      name: '',
      email: '',
      roleId: '',
      password: '',
      passwordConfirm: '',
    },
  });

  // 當編輯時，設置默認值
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name,
        email: defaultValues.email,
        roleId: defaultValues.role || defaultValues.roleId,
        password: '', // 編輯時密碼為空
        passwordConfirm: '',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        roleId: '',
        password: '',
        passwordConfirm: '',
      });
    }
  }, [defaultValues, form]);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      // 如果是編輯模式且密碼為空，則不包含密碼相關字段
      if (isEditing && (!values.password || values.password.trim() === '')) {
        const { password, passwordConfirm, roleId, ...dataWithoutPassword } = values;
        await onSubmit({
          ...dataWithoutPassword,
          role: roleId,
        });
      } else {
        // 新增用戶或更新密碼時
        const { roleId, ...otherValues } = values;
        await onSubmit({
          ...otherValues,
          role: roleId,
        });
      }

      // 只在新增用戶時重置表單
      if (!isEditing) {
        form.reset();
      }

      // 關閉對話框
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('userList.dialog.editTitle') : t('userList.dialog.createTitle')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('userList.form.name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('userList.form.email')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('userList.form.role')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('userList.form.selectRole')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.rolename}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditing ? t('userList.form.newPassword') : t('userList.form.password')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder={isEditing ? t('userList.form.passwordPlaceholder') : undefined}
                      required={!isEditing} // 新增時必填
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('userList.form.passwordConfirm')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder={t('userList.form.passwordConfirmPlaceholder')}
                      required={!isEditing || !!form.watch('password')} // 新增時必填，或編輯時有填寫密碼
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEditing ? t('common.save') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
