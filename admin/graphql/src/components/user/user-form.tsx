import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useRegisterMutation } from '@/graphql/auth.graphql';
import { useForm } from 'react-hook-form';
import { getErrorMessage } from '@/utils/form-error';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerValidationSchema } from './user-validation-schema';
import { Routes } from '@/config/routes';
import { toast } from 'react-toastify';

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const UserRegistrationForm = () => {
  const [registerUser, { loading }] = useRegisterMutation();
  const router = useRouter();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,

    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    resolver: yupResolver(customerValidationSchema),
  });

  async function onSubmit({ name, email, password }: FormValues) {
    try {
      await registerUser({
        variables: {
          input: {
            name,
            email,
            password,
          },
        },
      });
      router.push(Routes.user.list);
      toast.success(t('common:create-success'));
    } catch (error) {
      const serverErrors = getErrorMessage(error);
      Object.keys(serverErrors?.validation).forEach((field: any) => {
        setError(field.split('.')[1], {
          type: 'manual',
          message: serverErrors?.validation[field][0],
        });
      });
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:customer-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.name?.message!)}
            required
          />
          <Input
            label={t('form:input-label-email')}
            {...register('email')}
            type="email"
            variant="outline"
            className="mb-4"
            error={t(errors.email?.message!)}
            required
          />
          <PasswordInput
            label={t('form:input-label-password')}
            {...register('password')}
            error={t(errors.password?.message!)}
            variant="outline"
            className="mb-4"
            required
          />
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={loading} disabled={loading}>
          {t('form:button-label-create-customer')}
        </Button>
      </div>
    </form>
  );
};

export default UserRegistrationForm;
