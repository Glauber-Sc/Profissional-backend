import * as Yup from "yup";
import Order from "../models/Order";
import Product from "../models/Product";
import User from "../models/User";
import OrderItem from "../models/OrderItem";
import Category from "../models/Category";
import Address from "../models/Address"; // Importe o modelo de endereço aqui
import { subHours } from "date-fns";

class OrderController {
    async store(request, response) {
        const schema = Yup.object().shape({
            products: Yup.array()
                .of(
                    Yup.object().shape({
                        id: Yup.number().required(),
                        quantity: Yup.number().required(),
                    })
                )
                .required(),
            address_id: Yup.number().required(), // Novo campo para o endereço do usuário
        });

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { userId } = request;
        const { products, address_id } = request.body; // Adicione o campo address_id

        try {
            const user = await User.findByPk(userId);

            if (!user) {
                return response
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            const order = await Order.create({
                user_id: userId,
                status: "Pedido realizado",
                status_payment: false, // Adicione o campo status_payment com valor padrão false
                address_id: address_id, // Associando o endereço ao pedido
                createdAt: subHours(new Date(), 3),
            });

            await order.setAddress(address_id); // Associa o endereço ao pedido

            // Cria os items do pedido
            await Promise.all(
                products.map(async (productInfo) => {
                    const product = await Product.findByPk(productInfo.id);
                    if (!product) {
                        throw new Error(
                            `Produto com ID ${productInfo.id} não encontrado`
                        );
                    }

                    await OrderItem.create({
                        order_id: order.id,
                        product_id: product.id,
                        quantity: productInfo.quantity,
                    });
                })
            );

            return response.json(order);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Falha ao criar ordem" });
        }
    }

    async index(request, response) {
        try {
            const orders = await Order.findAll({
                where: {
                    status_payment: true,
                },
                include: [
                    {
                        model: OrderItem,
                        as: "products",
                        include: [
                            {
                                model: Product,
                                as: "product",
                                attributes: ["id", "name", "price", "path"],
                                include: [
                                    {
                                        model: Category,
                                        as: "category",
                                        attributes: ["id", "name"],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "email"],
                    },
                    {
                        model: Address, // Adicione a tabela de endereços
                        as: "address", // Alias para o endereço do usuário
                        attributes: ["id", "street"], // Coloque aqui os atributos desejados do endereço
                    },
                ],
            });

            const formattedOrders = orders.map((order) => {
                const formattedProducts = order.products.map((product) => {
                    return {
                        quantity: product.quantity,
                        name: product.product.name,
                        price: product.product.price,
                        category: product.product.category.name,
                        url: product.product.url,
                    };
                });

                return {
                    _id: order.id,
                    user: {
                        id: order.user.id,
                        name: order.user.name,
                        email: order.user.email,
                    },
                    address: {
                        id: order.address.id,
                        street: order.address.street,
                    },
                    products: formattedProducts,
                    status: order.status,
                    createdAt: order.createdAt,
                };
            });

            return response.json(formattedOrders);
        } catch (error) {
            console.error(error);
            return response
                .status(500)
                .json({ error: "Falha ao buscar pedidos" });
        }
    }

    async update(request, response) {
        const schema = Yup.object().shape({
            status: Yup.string().required(),
        });

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { userId } = request;

        try {
            const user = await User.findByPk(userId);

            if (!user) {
                return response
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            if (!user.admin) {
                return response.status(401).json({
                    error: "Você não está autorizado a executar esta ação",
                });
            }

            const { id } = request.params;
            const { status } = request.body;

            const order = await Order.findByPk(id);

            if (!order) {
                return response
                    .status(404)
                    .json({ error: "Ordem não encontrada" });
            }

            order.status = status;
            await order.save();

            return response.json({
                message: "Status atualizado com êxito",
                order,
            });
        } catch (error) {
            console.error(error);
            return response
                .status(500)
                .json({ error: "Falha ao atualizar a ordem" });
        }
    }





async customerOrders(request, response) {
    const { userId } = request;

    try {
        const orders = await Order.findAll({
            where: { user_id: userId }, // Filtra os pedidos pelo ID do usuário logado
            include: [
                {
                    model: OrderItem,
                    as: "products",
                    include: [
                        {
                            model: Product,
                            as: "product",
                            attributes: ["id", "name", "price", "path"],
                            include: [
                                {
                                    model: Category,
                                    as: "category",
                                    attributes: ["id", "name"],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"],
                },
                {
                    model: Address, // Adicione a tabela de endereços
                    as: "address", // Alias para o endereço do usuário
                    attributes: ["id", "street"], // Coloque aqui os atributos desejados do endereço
                },
            ],
        });

        const formattedOrders = orders.map((order) => {
            const formattedProducts = order.products.map((product) => {
                return {
                    quantity: product.quantity,
                    name: product.product.name,
                    price: product.product.price,
                    category: product.product.category.name,
                    url: product.product.url,
                };
            });

            return {
                _id: order.id,
                user: {
                    id: order.user.id,
                    name: order.user.name,
                    email: order.user.email,
                },
                address: {
                    id: order.address.id,
                    street: order.address.street,
                },
                products: formattedProducts,
                status: order.status,
                createdAt: order.createdAt,
            };
        });

        return response.json(formattedOrders);
    } catch (error) {
        console.error(error);
        return response
            .status(500)
            .json({ error: "Falha ao buscar pedidos" });
    }
}



}

export default new OrderController();

