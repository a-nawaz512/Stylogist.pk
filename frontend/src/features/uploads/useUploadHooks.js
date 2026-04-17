import { useMutation } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';

// Accepts either a raw File (backwards-compatible) OR an object:
// { file, productSlug, role, index, slug, metaTitle, metaDescription, alt }
export const useUploadImage = () => {
    return useMutation({
        mutationFn: async (arg) => {
            const file = arg instanceof File ? arg : arg.file;
            const opts = arg instanceof File ? {} : arg;
            const form = new FormData();
            form.append('file', file);
            if (opts.productSlug) form.append('productSlug', opts.productSlug);
            if (opts.role) form.append('role', opts.role);
            if (opts.index != null) form.append('index', String(opts.index));
            if (opts.slug) form.append('slug', opts.slug);
            if (opts.metaTitle) form.append('metaTitle', opts.metaTitle);
            if (opts.metaDescription) form.append('metaDescription', opts.metaDescription);
            if (opts.alt) form.append('alt', opts.alt);
            const { data } = await axiosClient.post('/uploads/image', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data.data;
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Upload failed');
        },
    });
};

// Accepts FileList/File[] OR { files, productSlug, startIndex, metaTitle, metaDescription }
export const useUploadImages = () => {
    return useMutation({
        mutationFn: async (arg) => {
            const files = Array.isArray(arg) || arg instanceof FileList ? arg : arg.files;
            const opts = Array.isArray(arg) || arg instanceof FileList ? {} : arg;
            const form = new FormData();
            Array.from(files).forEach((f) => form.append('files', f));
            if (opts.productSlug) form.append('productSlug', opts.productSlug);
            if (opts.startIndex != null) form.append('startIndex', String(opts.startIndex));
            if (opts.metaTitle) form.append('metaTitle', opts.metaTitle);
            if (opts.metaDescription) form.append('metaDescription', opts.metaDescription);
            const { data } = await axiosClient.post('/uploads/images', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data.data;
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Upload failed');
        },
    });
};
